import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import userRoutes from './routes/userRoutes.js';
import User from './models/User.js'; // Import du modèle User

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connecté');
        createAdminUser(); // Création de l'admin après la connexion
    })
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

app.use('/api/users', userRoutes);

// Création automatique de l'admin si non existant
const createAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ email: "loise.fenoll@ynov.com" });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("ANKymoUTFu4rbybmQ9Mt", 10);
            const admin = new User({
                firstName: "Loise",
                lastName: "Fenoll",
                email: "loise.fenoll@ynov.com",
                birthDate: "1990-01-01",
                city: "Paris",
                postalCode: "75000",
                password: hashedPassword,
                isAdmin: true
            });

            await admin.save();
            console.log("Administrateur créé !");
        }
    } catch (error) {
        console.error("Erreur lors de la création de l'admin :", error);
    }
};

// Lancement du serveur
const server = app.listen(PORT, () => {
    console.log(`Serveur backend en cours d'exécution sur le port ${PORT}`);
});

// Exportation de `app` pour les tests
export default app;
