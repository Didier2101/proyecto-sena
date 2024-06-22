import { NavLink, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

import { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Swal from 'sweetalert2';






function Login() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [cargos, setCargos] = useState([]);
    const [cargoSeleccionado, setCargoSeleccionado] = useState('');



    const obtenerCargos = async () => {
        try {
            const response = await fetch('http://localhost:4000/cargos');
            if (response.ok) {
                const data = await response.json();
                setCargos(data);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        obtenerCargos();
    }, []);




    const handdleLogin = async (e) => {
        e.preventDefault();
        const data = {
            usuario: usuario,
            contrasena: contrasena,
            cargo: cargoSeleccionado,
        };

        try {
            const response = await fetch('http://localhost:4000/ingresar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: "Éxito",
                    text: result.message,
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false
                });
                // Redirigir al usuario a otra página si es necesario
                const cargoSeleccionadoObj = cargos.find(cargo => cargo.id_cargo === cargoSeleccionado);


                switch (cargoSeleccionadoObj.nombre_cargo) {
                    case 'Administrador':
                        console.log("¡Bienvenido Administrador!");
                        navigate('/Administrador', { replace: true });
                        break;
                    case 'Bodeguero':
                        console.log("¡Bienvenido Bodeguero!");
                        navigate('/', { replace: true });
                        break;
                    case 'Vendedor':
                        console.log("¡Bienvenido Vendedor!");
                        navigate('/Vendedor', { replace: true });
                        break;
                    case 'Auxiliar':
                        navigate('/', { replace: true });
                        break;
                    default:
                        console.log(`Usuario con cargo "${cargoSeleccionado}" ha iniciado sesión`);
                        break;
                }

                // setTimeout(() => {
                //     navigate('/Home', { replace: true });


                // }, 1000);
            } else {
                Swal.fire({
                    title: "Error",
                    text: result.message,
                    icon: "error",
                    showConfirmButton: true,
                });
            }



        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <div className='container-all'>
                <div className='img'>
                    <p>todo a su lado</p>
                </div>
                <div className="container-login">


                    <section className='contain-form-login'>

                        <h2>¡Bienvenido de nuevo!</h2>
                        <p>¡Nos alegra mucho que hayas regresado!</p>
                        <form className='form-login' onSubmit={handdleLogin}>
                            <FormControl required sx={{ width: '100%' }}>
                                <InputLabel>Ingrese su cargo</InputLabel>
                                <Select
                                    name="cargo"
                                    // required
                                    value={cargoSeleccionado}
                                    onChange={(e) => setCargoSeleccionado(e.target.value)}
                                >
                                    {cargos.map(cargo =>
                                        <MenuItem key={cargo.id_cargo} value={cargo.id_cargo}>
                                            {cargo.nombre_cargo}
                                        </MenuItem>
                                    )}
                                </Select>

                            </FormControl>
                            <TextField
                                fullWidth
                                label="Usuario"
                                required
                                name='usuario'
                                InputLabelProps={{ className: 'custom-label' }}
                                onChange={(e) => setUsuario(e.target.value)}
                            />

                            <TextField
                                fullWidth
                                label="Contraseña"
                                required
                                name='contrasena'
                                type='password'
                                InputLabelProps={{ className: 'custom-label' }}
                                onChange={(e) => setContrasena(e.target.value)}
                            />

                            <Button
                                type='submit'
                                variant="contained"
                                fullWidth
                                style={{
                                    height: '40px',
                                    fontSize: '1.2rem',
                                    backgroundColor: 'var(--segundo)'
                                }}

                            >
                                acceder
                            </Button>

                        </form>
                        <NavLink
                            style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--tercero)' }}
                            to="/forgot-password"
                        >¿Olvidaste tu contraseña?</NavLink>
                    </section>
                </div>
            </div >
        </>
    );
}

export default Login;
