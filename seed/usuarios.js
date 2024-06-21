import bcrypt from 'bcrypt';
const usuarios =[
    {
        nombre: 'Raul',
        email:"raul@gmail.com",
        confirmado:1,
        password: bcrypt.hashSync('12345', 10)
    }
]
export default usuarios;