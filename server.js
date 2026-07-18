const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const recommendationRoutes = require('./routes/recommandationRoutes');
const favoriteScheme = require('./routes/favoriteRoutes');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth/", authRouter);

app.use("/api/profile/", profileRoutes);

app.use("/api/schemes", schemeRoutes);

app.use("/api/recommendation", recommendationRoutes);

app.use('/api/favorites', favoriteScheme);

app.get('/', (req, res) => {
    res.send("JanSahay Backend is running");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})