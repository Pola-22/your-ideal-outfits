import jwt from 'jsonwebtoken';

export const generateJwt = (id: string) => {
    const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '1d'
    });

    return jwtToken;
}