import * as bcrypt from 'bcrypt';

export const hashData = async (data: string) => {
    return await bcrypt.hash(data, 15);
}

export const compareHashedData =
    async (plain: string, hash: string) => {
    return await bcrypt.compare(plain, hash);
}