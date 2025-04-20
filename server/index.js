// Packages to be imported
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const Logout = require("./routes/auth/logout");
const AddUserDetails = require("./routes/userDetails/addUserDetails");
const GetUserDetails = require("./routes/userDetails/getUserDetails");
const UpdateUserDetails = require("./routes/userDetails/updateUserDetails");
const GetBatchList = require("./routes/batchList/getBatchList");

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);

// Supabase initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const idToken = authHeader.split("Bearer ")[1];
    req.token = idToken;

    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        req.uid = decodedToken.uid;
        req.email = decodedToken.email;
        next();
      })
      .catch((error) => {
        res.status(401).json({ message: "Unauthorized" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

//auth
app.get("/api/logout", authenticateToken, Logout());

//user details
app.get(
  "/api/get-user-details",
  authenticateToken,
  GetUserDetails(admin, supabase)
);

app.post(
  "/api/add-user-details",
  authenticateToken,
  AddUserDetails(admin, supabase)
);

app.put(
  "/api/update-user-details",
  authenticateToken,
  UpdateUserDetails(admin, supabase)
);

//batch list
app.get("/api/get-batch-list", authenticateToken, GetBatchList(supabase));

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
