import jwt from 'jsonwebtoken';

const secretKey = 'my_secretKey';

export const generateToken = (userId, role,email) => {
    const token = jwt.sign({userId, role,email},secretKey,{expiresIn:'7d'});
    return token;
};

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        console.log(error)
        throw new Error('Invalid token');
    }
}