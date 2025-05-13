// Packages to be imported
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const http = require("http");
const { Server } = require("socket.io");
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
const CreateCategory = require("./routes/food/category/createCategory");
const UpdateCategory = require("./routes/food/category/updateCategory");
const DeleteCategory = require("./routes/food/category/deleteCategory");
const FetchCategories = require("./routes/food/category/fetchCategories");
const FetchSpecificCategory = require("./routes/food/category/fetchSpecificCategory");
const CreateFood = require("./routes/food/foodList/createFood");
const UpdateFood = require("./routes/food/foodList/updateFood");
const DeleteFood = require("./routes/food/foodList/deleteFood");
const FetchFoods = require("./routes/food/foodList/fetchFoods");
const FetchSpecificFood = require("./routes/food/foodList/fetchSpecificFood");
const GetCartItems = require("./routes/userDetails/getCartItems");
const GetSpecificCartItem = require("./routes/userDetails/getSpecificCartItem");
const AddToCart = require("./routes/userDetails/addToCart");
const QuantityUpdate = require("./routes/userDetails/quantityUpdate");
const GetQuantityOfSpecificFood = require("./routes/userDetails/getQuantityofSpecificFood");
const DeleteCartItem = require("./routes/userDetails/deleteCartItem");
const ShopLogin = require("./routes/shopAuth/shopLogin");
const Order = require("./routes/orders/order");
const GetOrderHistory = require("./routes/orders/getOrderHistory");
const GetUserOrder = require("./routes/orders/getUserOrder");
const UpdateDeliveryStatus = require("./routes/orders/updateDeliveryStatus");

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
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.ADMIN_APP_URL,
      process.env.COUNTER_APP_URL,
      process.env.FRONTEND_URL,
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ],
  },
});

const corsOptions = {
  origin: [
    process.env.ADMIN_APP_URL,
    process.env.COUNTER_APP_URL,
    process.env.FRONTEND_URL,
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
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

const authenticateUserToken = async (req, res, next) => {
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

const authenticateAdminEmail = async (req, res, next) => {
  try {
    if (!req.email || !req.uid) {
      return res.status(400).json({ error: "Missing email or uid" });
    }

    const { data, error } = await supabase
      .from("admin_accounts")
      .select("*")
      .eq("email", req.email)
      .eq("uid", req.uid)
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }

    if (data) {
      next();
    } else {
      if (error && error.code === "PGRST116") {
        return res.status(500).json({
          message: "Use admin account",
          error: error.message,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Error verifing admin",
      error: error.message,
    });
  }
};

const authenticateCounterEmail = async (req, res, next) => {
  try {
    if (!req.email || !req.uid) {
      return res.status(400).json({ error: "Missing email or uid" });
    }

    const { data, error } = await supabase
      .from("shop_accounts")
      .select("*")
      .eq("email", req.email)
      .eq("uid", req.uid)
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }

    if (data) {
      next();
    } else {
      if (error && error.code === "PGRST116") {
        return res.status(500).json({
          message: "Use counter account",
          error: error.message,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Error verifing counter",
      error: error.message,
    });
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
  authenticateAdminEmail,
  AccountCreation(admin, supabase)
);
app.get(
  "/api/admin/fetch-accounts",
  authenticateToken,
  authenticateAdminEmail,
  FetchAccounts(supabase)
);
app.get(
  "/api/admin/fetch-specific-account/:uid",
  authenticateToken,
  authenticateAdminEmail,
  FetchSpecificAccount(supabase)
);
app.put(
  "/api/admin/update-account",
  authenticateToken,
  authenticateAdminEmail,
  UpdateAccount(admin, supabase)
);
app.delete(
  "/api/admin/delete-account",
  authenticateToken,
  authenticateAdminEmail,
  DeleteAccount(admin, supabase)
);

//user details
app.get("/api/get-user-details", authenticateToken, GetUserDetails(supabase));

app.post(
  "/api/add-user-details",
  authenticateUserToken,
  AddUserDetails(admin, supabase)
);

app.put(
  "/api/update-user-details",
  authenticateToken,
  UpdateUserDetails(supabase)
);

//food category
app.get("/api/fetch-categories", FetchCategories(supabase));
app.get(
  "/api/admin/fetch-specific-category/:id",
  authenticateToken,
  authenticateAdminEmail,
  FetchSpecificCategory(supabase)
);
app.post(
  "/api/admin/create-category",
  authenticateToken,
  authenticateAdminEmail,
  CreateCategory(supabase)
);
app.put(
  "/api/admin/update-category",
  authenticateToken,
  authenticateAdminEmail,
  UpdateCategory(supabase)
);
app.delete(
  "/api/admin/delete-category",
  authenticateToken,
  authenticateAdminEmail,
  DeleteCategory(supabase)
);

//food list
app.get("/api/fetch-foods/:category_id", FetchFoods(supabase));
app.get("/api/fetch-specific-food/:id", FetchSpecificFood(supabase));
app.post(
  "/api/admin/create-food",
  authenticateToken,
  authenticateAdminEmail,
  CreateFood(supabase)
);
app.put(
  "/api/admin/update-food",
  authenticateToken,
  authenticateAdminEmail,
  UpdateFood(supabase)
);
app.delete(
  "/api/admin/delete-food",
  authenticateToken,
  authenticateAdminEmail,
  DeleteFood(supabase)
);

//batch list
app.get("/api/get-batch-list", authenticateToken, GetBatchList(supabase));

//cart
app.get("/api/get-cart-items", authenticateToken, GetCartItems(supabase));
app.get(
  "/api/get-specific-cart-item/:food_id",
  authenticateToken,
  GetSpecificCartItem(supabase)
);
app.get(
  "/api/get-quantity-of-specific-food/:id",
  authenticateToken,
  GetQuantityOfSpecificFood(supabase)
);
app.post("/api/add-to-cart", authenticateToken, AddToCart(supabase));
app.put("/api/update-quantity", authenticateToken, QuantityUpdate(supabase));
app.delete(
  "/api/delete-item-in-cart",
  authenticateToken,
  DeleteCartItem(supabase)
);

app.get("/api/get-order-history", authenticateToken, GetOrderHistory(supabase));
app.post("/api/order", authenticateToken, Order(supabase));

app.get("/api/counter/login", authenticateToken, ShopLogin(supabase));

app.get(
  "/api/get-user-order/:id",
  authenticateToken,
  authenticateCounterEmail,
  GetUserOrder(supabase)
);
app.put(
  "/api/update-delivery-status",
  authenticateToken,
  authenticateCounterEmail,
  UpdateDeliveryStatus(supabase)
);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

supabase
  .channel("realtime:food_list")
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "food_list",
    },
    (payload) => {
      const id = payload.new.id;
      const quantity = payload.new.quantity;

      io.emit("food_quantity_update", { id, quantity });
    }
  )
  .subscribe();

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
