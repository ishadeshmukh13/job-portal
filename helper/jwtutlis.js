import jwt from 'jsonwebtoken';

const secretKey = 'my_secretKey';

export const generateToken = (userId, role) => {
    const token = jwt.sign({userId, role},secretKey,{expiresIn:'5h'});
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