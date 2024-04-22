

require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const port = 5001;
const mongoUri = 'mongodb+srv://vikkolla:51owp5epaYDgv04K@healthmate.uikhmuk.mongodb.net/healthmate?retryWrites=true&w=majority';
process.env.MONGO_URI = mongoUri;
const mongoClient = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = process.env.MONGO_DB_NAME;
const userCollectionName = 'users';

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const session = require('express-session');



app.use(
  session({
    secret: 'your-session-secret', // Replace this with a secure, unique secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration to 1 day
    },
  })
);

// Initialize passport and use the Google OAuth strategy
app.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (error) {
    done(error, null);
  } finally {
    await mongoClient.close();
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        await mongoClient.connect();
        const userCollection = mongoClient.db(dbName).collection(userCollectionName);

        const existingUser = await userCollection.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          type: "client"
        };

        const result = await userCollection.insertOne(newUser);
        return done(null, newUser);
      } catch (error) {
        done(error, null);
      } finally {
        await mongoClient.close();
      }
    }
  )
);


app.get('/api/users/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user.');
  } finally {
    await mongoClient.close();
  }
});




// Google OAuth routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/login' }),
  (req, res) => {

    // alert("Authentication successful.Redirecting! Please wait!")
    // Successful authentication, redirect home.
    // res.send("Authentication Successful");
    res.redirect('https://healthmate-frontend.onrender.com');

  }
);

function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log("token", token);
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
}


app.get('/api/posts', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    await mongoClient.connect();
    const workoutsCollection = mongoClient.db(dbName).collection('workouts');
    const query = searchQuery
      ? {
        $or: [
          { type: { $regex: searchQuery, $options: 'i' } },
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { name: { $regex: searchQuery, $options: 'i' } },
        ],
      }
      : {};
    const posts = await workoutsCollection.find(query).toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching posts.');
  } finally {
    await mongoClient.close();
  }
});

app.get('/api/posts_admin', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    await mongoClient.connect();
    const workouts_stagingCollection = mongoClient.db(dbName).collection('workouts_staging');
    const query = searchQuery
      ? {
        $or: [
          { type: { $regex: searchQuery, $options: 'i' } },
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { name: { $regex: searchQuery, $options: 'i' } },
        ],
      }
      : {};
    const posts = await workouts_stagingCollection.find(query).toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching posts.');
  } finally {
    await mongoClient.close();
  }
});



app.post('/api/newpost', verifyToken, async (req, res) => {

  const { title, description, type, email, name } = req.body;

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const user = await userCollection.findOne({ email: email });
    const workouts_stagingCollection = mongoClient.db(dbName).collection('workouts_staging');

    const newPost = {
      title,
      description,
      type,
      email: user.email,
      name: user.firstName + " " + user.lastName,
      createdAt: new Date(),
    };

    const result = await workouts_stagingCollection.insertOne(newPost);
    res.status(201).send('Post submitted successfully.');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error submitting the post.');
  } finally {
    await mongoClient.close();
  }
});



app.put('/api/posts_approve/:postId', verifyToken, async (req, res) => {

  await mongoClient.connect();
  const postId = req.params.postId;
  try {
  const workoutsStagingCollection = mongoClient.db(dbName).collection("workouts_staging");
  const workoutsCollection = mongoClient.db(dbName).collection("workouts");


  const post = await workoutsStagingCollection.findOne({ _id: new ObjectId(postId) });

  const newId = new ObjectId();
  const updatedPost = {
    _id: newId,
    title: post.title,
    description: post.description,
    type: post.type,
    email: post.email,
    name: post.name,
    createdAt: new Date(),
  };
  
  const result = await workoutsCollection.insertOne(updatedPost);
  console.log("Result:",result);
  if (result.acknowledged === true) {
    await workoutsStagingCollection.deleteOne({ _id: new ObjectId(postId) });
    res.status(200).send("Post approved and moved to workouts collection.");

  } else {
    console.log("Error")
    res.status(500).send("Error moving the post to workouts collection.");
  }

  }
  catch (error) {
    console.error(error);
    res.status(500).send("Error approving the post.");
  } finally {
    await mongoClient.close();
  }

});

app.put('/api/posts_reject/:postId', verifyToken, async (req, res) => {

  console.log("Inside posts_reject")
  await mongoClient.connect();
  const postId = req.params.postId;
  try {
  const workoutsStagingCollection = mongoClient.db(dbName).collection("workouts_staging");

  const result = await workoutsStagingCollection.deleteOne({ _id: new ObjectId(postId) });

  if (result.acknowledged === true) {
    res.status(200).send("Post deleted!");

  } else {
    console.log("Error")
    res.status(500).send("Error deleting the post.");
  }

  }
  catch (error) {
    console.error(error);
    res.status(500).send("Error approving the post.");
  } finally {
    await mongoClient.close();
  }

});



app.post('/api/reviews', async (req, res) => {
  const { postId, rating, review, user } = req.body;

  try {
    await mongoClient.connect();
    const reviewsCollection = mongoClient.db(dbName).collection('reviews');

    const newReview = {
      postId: new ObjectId(postId),
      rating: parseInt(rating),
      review: review,
      user: new ObjectId(user),
      createdAt: new Date(),
    };

    const result = await reviewsCollection.insertOne(newReview);
    res.status(201).send('Review submitted successfully.');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error submitting the review.');
  } finally {
    await mongoClient.close();
  }
});

// app.post('/api/posts/:postId/reviews', async (req, res) => {
//   const { postId } = req.params;
//   const review = req.body; 
//   try {
//     await mongoClient.connect();
//     const workoutsCollection = mongoClient.db(dbName).collection('workouts');
//     const post = await workoutsCollection.findOne({ _id: new ObjectId(postId) });

//     if (post) {
//       const updatedPost = await workoutsCollection.updateOne(
//         { _id: new ObjectId(postId) },
//         { $push: { reviews: review }}
//       );

//       if (updatedPost.matchedCount > 0) {
//         res.status(200).json({ message: 'Review added successfully.' });
//       } else {
//         res.status(500).send('Error adding review.');
//       }
//     } else {
//       res.status(404).send('Post not found.');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error saving review.');
//   } finally {
//     await mongoClient.close();
//   }
// });

app.post('/api/posts/:postId/reviews', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { userId, userType, rating, review, fullName, email } = req.body;

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);

    const workoutsCollection = mongoClient.db(dbName).collection('workouts');
    const post = await workoutsCollection.findOne({ _id: new ObjectId(postId) });

    const newReview = {
      userId,
      userType,
      rating,
      review,
      fullName,
      email,
      createdAt: new Date(),
    };

    if (post) {
      const updatedPost = await workoutsCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { reviews: newReview } }
      );

      if (updatedPost.matchedCount > 0) {
        await mongoClient.close();
        res.status(200).json({ message: 'Review added successfully.' });
      } else {
        await mongoClient.close();
        res.status(500).send('Error adding review.');
      }
    } else {
      await mongoClient.close();
      res.status(404).send('Post not found.');
    }
  } catch (error) {
    console.error(error);
    await mongoClient.close();
    res.status(500).send('Error saving review.');
  }
});










app.get('/api/posts/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    await mongoClient.connect();
    const workoutsCollection = mongoClient.db(dbName).collection('workouts');
    const post = await workoutsCollection.findOne({ _id: new ObjectId(postId) });

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).send('Post not found.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching post details.');
  } finally {
    await mongoClient.close();
  }
});


app.get('/api/posts_admin/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    await mongoClient.connect();
    const workouts_stagingCollection = mongoClient.db(dbName).collection('workouts_staging');
    const post = await workouts_stagingCollection.findOne({ _id: new ObjectId(postId) });

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).send('Post not found.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching post details.');
  } finally {
    await mongoClient.close();
  }
});



app.get('/api/users/:userType/:userId', async (req, res) => {
  const { userType, userId } = req.params;
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("userId print in usertype of server.js",userId,userType);
    req.user = decoded;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID in usertype.');
    }

    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const user = await userCollection.findOne({ _id: new ObjectId(userId), type: userType });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user details from MongoDB');
  } finally {
    await mongoClient.close();
  }
});


app.get('/api/fp_list', async (req, res) => {
  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const fitnessProfessionals = await userCollection.find({ type: 'fitness-professional' }).toArray();
    res.status(200).json(fitnessProfessionals);
  } catch (error) {
    console.error('Error fetching fitness professionals:', error);
    res.status(500).send('Error fetching fitness professionals.');
  } 
});



app.post('/api/subscribe/:professionalId', async (req, res) => {
  const professionalId = req.params.professionalId;
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).send('User ID is required.');
  }

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);

    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const professional = await userCollection.findOne({ _id: new ObjectId(professionalId) });
    if (!professional) {
      return res.status(404).send('Fitness professional not found.');
    }

    const subscriberData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const professionalData = {
      _id: professional._id,
      firstName: professional.firstName,
      lastName: professional.lastName,
      email: professional.email,
    };

    const updateProfessionalResult = await userCollection.updateOne(
      { _id: new ObjectId(professionalId) },
      { $addToSet: { subscribers: subscriberData } }
    );

    const updateUserResult = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { subscribed: professionalData } }
    );

    if (updateProfessionalResult.modifiedCount === 1 && updateUserResult.modifiedCount === 1) {
      res.status(200).send('Successfully subscribed to the fitness professional.');
    } else {
      res.status(500).send('Error subscribing to the fitness professional.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error subscribing to the fitness professional.');
  } finally {
    await mongoClient.close();
  }
});


app.post('/api/unsubscribe/:professionalId', async (req, res) => {
  const professionalId = req.params.professionalId;
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).send('User ID is required.');
  }

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);

    const updateUserResult = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { subscribed: { _id: new ObjectId(professionalId) } } }
    );

    if (updateUserResult.modifiedCount === 1) {
      res.status(200).send('Successfully unsubscribed from the fitness professional.');
    } else {
      res.status(500).send('Error unsubscribing from the fitness professional.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error unsubscribing from the fitness professional.');
  } finally {
    await mongoClient.close();
  }
});


app.get('/api/users_rec/:userId/recommendations', verifyToken, async (req, res) => {
  const userId = req.params.userId;
  console.log("UserId in recommendations for server", userId);
  // if (!ObjectId.isValid(userId)) {
  //   console.error('Invalid user ID:', userId);
  //   return res.status(400).send('Invalid user ID.');
  // }
  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection('users');
    const workoutsCollection = mongoClient.db(dbName).collection('workouts');

    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    console.log("User in recommendations", user)
    if (!user) {
      res.status(404).send('User not found.');
    } else {
      const subscribedProfessionalEmail = user.subscribed.map(professional => professional.email);      
      console.log("subscribed professionals", subscribedProfessionalEmail)
      const subscribedPosts = await workoutsCollection.find({ "email": { $in: subscribedProfessionalEmail } }).toArray();

      res.status(200).json(subscribedPosts);
    }
  } catch (error) {
    console.error('Error fetching subscribed posts:', error.message);
    res.status(500).send('Error fetching subscribed posts.');
  } finally {
    await mongoClient.close();
  }
});




app.post('/api/chat', async (req, res) => {
  const { sender_email, receiver_email, message, time } = req.body;

  try {
    await mongoClient.connect();
    const chatCollection = mongoClient.db(dbName).collection('chat');

    const newMessage = {
      sender_email: sender_email,
      receiver_email: receiver_email,
      message: message,
      time: time,
    };

    const result = await chatCollection.insertOne(newMessage);
    res.status(201).send('Message sent successfully.');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error sending the message.');
  } finally {
    await mongoClient.close();
  }
});


app.get('/api/chat/:senderEmail/:receiverEmail', async (req, res) => {
  const { senderEmail, receiverEmail } = req.params;

  try {
    await mongoClient.connect();
    const chatCollection = mongoClient.db(dbName).collection('chat');

    const messages = await chatCollection
      .find({
        $or: [
          { sender_email: senderEmail, receiver_email: receiverEmail },
          { sender_email: receiverEmail, receiver_email: senderEmail },
        ],
      })
      .toArray();

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chat messages.');
  } finally {
    await mongoClient.close();
  }
});

app.get('/api/professional/chat/users/:professionalEmail', async (req, res) => {
  const professionalEmail = req.params.professionalEmail;

  try {
    await mongoClient.connect();
    const chatCollection = mongoClient.db(dbName).collection('chat');

    // Get unique users who sent messages to the professional
    const users = await chatCollection.aggregate([
      { $match: { receiver_email: professionalEmail } },
      { $group: { _id: '$sender_email' } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'email',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $project: { _id: '$user._id', firstName: '$user.firstName', lastName: '$user.lastName', email: '$user.email' } },
    ]).toArray();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching users.');
  } finally {
    await mongoClient.close();
  }
});

app.get('/api/professional/chat/:professionalEmail/:userEmail', async (req, res) => {
  const professionalEmail = req.params.professionalEmail;
  const userEmail = req.params.userEmail;

  try {
    await mongoClient.connect();
    const chatCollection = mongoClient.db(dbName).collection('chat');

    // Get the chat messages between the professional and the user
    const messages = await chatCollection.find({
      $or: [
        { sender_email: professionalEmail, receiver_email: userEmail },
        { sender_email: userEmail, receiver_email: professionalEmail },
      ],
    }).sort({ time: 1 }).toArray();

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chat messages.');
  } finally {
    await mongoClient.close();
  }
});



// Your other routes and app.listen() should remain the same




app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password, type } = req.body;

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const existingUser = await userCollection.findOne({ email: email });

    if (existingUser) {
      return res.status(400).send('User already exists.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      type: type,
    };

    const result = await userCollection.insertOne(newUser);
    res.status(201).send('User registered successfully.');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error registering the user.');
  } finally {
    await mongoClient.close();
  }
});

app.post('/api/updateProfile', async (req, res) => {
  const { email, firstName, lastName } = req.body;

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);

    const result = await userCollection.updateOne({ email: email }, { $set: { firstName: firstName, lastName: lastName } });

    if (result.modifiedCount === 0) {
      return res.status(404).send('User not found.');
    }

    res.status(200).send('Profile updated successfully.');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error updating the profile.');
  } finally {
    await mongoClient.close();
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const user = await userCollection.findOne({ email: email });

    if (user) {
      // Compare the provided password with the stored password
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Create a JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email, type: user.type, name: user.firstName + '' + user.lastName },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
        console.log("user details in Login", user);
        res.status(200).json({
          message: 'Login successful.',
          token: token,
          user: { id: user._id, email: user.email, type: user.type, name: user.firstName + '' + user.lastName },
        });
      } else {
        res.status(401).send('Invalid password.');
      }
    } else {
      res.status(404).send('User not found.');
    }
  } catch (error) {
    console.error(error);
    res.status(400).send('Error Logging in.');
  } finally {
    await mongoClient.close();
  }
});

let otp = 0;
let userResetEmail = '';

app.post('/api/checkValidEmail', async (req, res) => {
  const { email } = req.body;
  userResetEmail = '';
  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const user = await userCollection.findOne({ email: email });

    if (user) {
      userResetEmail = email;
      const nodemailer = require('nodemailer');

      otp = Math.floor(Math.random() * 1000000);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sakshi.sitoot@gmail.com',
          pass: 'vfvc dgmz xoqw kclm'
        }
      });

      transporter.sendMail({
        from: 'sakshi.sitoot@gmail.com', 
        to: email,
        subject: 'Reset Password OTP', 
        html: `Welcome to HEALTHMATE !! Your OTP is ${otp}` 
      })
        .then(info => console.log(info))
        .catch(error => console.log(error));
        res.status(201).send('OTP sent successfully.');

    } else {
      res.status(404).send('User not found.');
    }
  } catch (error) {
    console.error(error);
    res.status(400).send('Error Sending OTP.');
  } finally {
    await mongoClient.close();
  }
});


app.post('/api/verifyOTP', async (req, res) => {
  const { user_otp } = req.body;

  try {

    if(user_otp != otp)
    {
      res.status(400).send('Invalid OTP.');
    }

    res.status(201).send('OTP Verified successfully.');

  } catch (error) {
    console.error(error);
    res.status(400).send('Error Sending OTP.');
  } finally {
    await mongoClient.close();
  }
});

app.post('/api/resetPassword', async (req, res) => {
  const { password, cpassword } = req.body;

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userCollection.updateOne({ email: userResetEmail }, { $set: { password: hashedPassword} });

    if (result.modifiedCount === 0) {
      return res.status(404).send('User not found.');
    }

    res.status(201).send('Password has been reset successfully.');

  } catch (error) {
    console.error(error);
    res.status(400).send('Error Sending OTP.');
  } finally {
    await mongoClient.close();
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

