import User from '../models/User'; // Assicurati che il percorso sia corretto

const resolvers = {
    users: async ({ name }: { name?: string }) => {
        try {
            let query = {};
            if (name) {
                // Ricerca case-insensitive su fullName o username
                query = {
                    $or: [
                        { fullName: { $regex: name, $options: 'i' } },
                        { username: { $regex: name, $options: 'i' } }
                    ]
                };
            }
            const users = await User.find(query, '-password'); // Escludi la password
            return users;
        } catch (error) {
            console.error('Error fetching users in GraphQL resolver:', error);
            throw new Error('Errore durante il recupero degli utenti.');
        }
    },
};

export default resolvers;