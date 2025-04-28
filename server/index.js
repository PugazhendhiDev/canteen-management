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
const AccountCreation = require("./routes/accountManagement/accountCreation");
const FetchAccounts = require("./routes/accountManagement/fetchAccounts");
const FetchSpecificAccount = require("./routes/accountManagement/fetchSpecificAccount");
const UpdateAccount = require("./routes/accountManagement/updateAccount");
const DeleteAccount = require("./routes/accountManagement/deleteAccount");
const AdminAccountCreation = require("./routes/adminAuth/adminAccountCreation");
const AdminLogin = require("./routes/adminAuth/adminLogin");
const CreateCatagory = require("./routes/food/catagory/createCatagory");
const UpdateCatagory = require("./routes/food/catagory/updateCatagory");
const DeleteCatagory = require("./routes/food/catagory/deleteCatagory");
const FetchCatagories = require("./routes/food/catagory/fetchCatagories");
const FetchSpecificCatagory = require("./routes/food/catagory/fetchSpecificCatagory");
const CreateFood = require("./routes/food/foodList/createFood");
const UpdateFood = require("./routes/food/foodList/updateFood");
const DeleteFood = require("./routes/food/foodList/deleteFood");
const FetchFoods = require("./routes/food/foodList/fetchFoods");
const FetchSpecificFood = require("./routes/food/foodList/fetchSpecificFood");

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
  origin: [
    process.env.ADMIN_APP_URL,
    process.env.FRONTEND_URL,
    "http://192.168.21.152:5000",
  ],
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
        if (!decodedToken.email_verified) {
          return res.status(403).json({ message: "Email not verified" });
        }

        req.uid = decodedToken.uid;
        req.email = decodedToken.email;
        next();
      })
      .catch((error) => {
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Unauthorized" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const authenticateAdminToken = async (req, res, next) => {
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
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Unauthorized" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

//auth
app.get("/api/logout", authenticateToken, Logout());

//admin auth
app.post(
  "/api/admin/create-admin-account",
  authenticateAdminToken,
  AdminAccountCreation(admin, supabase)
);
app.post("/api/admin/login", authenticateToken, AdminLogin(supabase));

//Account Management (admin)
app.post(
  "/api/admin/create-account",
  authenticateToken,
  AccountCreation(admin, supabase)
);
app.get(
  "/api/admin/fetch-accounts",
  authenticateToken,
  FetchAccounts(supabase)
);
app.get(
  "/api/admin/fetch-specific-account/:uid",
  authenticateToken,
  FetchSpecificAccount(supabase)
);
app.put(
  "/api/admin/update-account",
  authenticateToken,
  UpdateAccount(admin, supabase)
);
app.delete(
  "/api/admin/delete-account",
  authenticateToken,
  DeleteAccount(admin, supabase)
);

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

//food catagory
app.get("/api/fetch-catagories", FetchCatagories(supabase));
app.get(
  "/api/admin/fetch-specific-catagory/:id",
  FetchSpecificCatagory(supabase)
);
app.post("/api/admin/create-catagory", CreateCatagory(supabase));
app.put("/api/admin/update-catagory", UpdateCatagory(supabase));
app.delete("/api/admin/delete-catagory", DeleteCatagory(supabase));

//food list
app.get("/api/fetch-foods/:id", FetchFoods(supabase));
app.get("/api/admin/fetch-specific-food/:id", FetchSpecificFood(supabase));
app.post("/api/admin/create-food", CreateFood(supabase));
app.put("/api/admin/update-food", UpdateFood(supabase));
app.delete("/api/admin/delete-food", DeleteFood(supabase));

//batch list
app.get("/api/get-batch-list", authenticateToken, GetBatchList(supabase));

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
