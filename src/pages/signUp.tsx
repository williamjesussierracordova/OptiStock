import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { validateEmail, validatePassword } from "../utils/validator"
import { useSessionStore } from "@/store/sessionStore"
import { IoMdClose } from "react-icons/io"
import { AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FaExclamationTriangle as ExclamationTriangleIcon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false)
    const { register, loading, error, clearError } = useSessionStore();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        // Verificar si todos los campos son válidos
        const areAllFieldsValid =
            !errors.email &&
            !errors.password &&
            formData.email &&
            formData.password;

        setIsFormValid(areAllFieldsValid);
    }, [formData, errors]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })

        let error = '';

        switch (e.target.name) {
            case "email":
                if (!validateEmail(e.target.value)) {
                    error = "Correo invalido"
                }
                break
            case "password":
                if (!validatePassword(e.target.value)) {
                    error = "Contraseña invalida"
                }
                break
            case "code":
                if (e.target.value.length < 6) {
                    error = "Codigo invalido"
                }
                break
            default:
                break
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [e.target.name]: error
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(formData.email, formData.password, "", navigate);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6">
                        <img
                            src="/chartLine.svg"
                            alt="OptiStock"
                        />
                    </div>
                    <span className="text-lg font-semibold">OptiStock</span>
                </div>
                <a
                    href="/"
                    className="text-sm text-gray-400 hover:text-white transition-colors "
                >
                    Sign In
                </a>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 min-h-[calc(100vh-80px)]">
                <div className="hidden lg:flex flex-col justify-center p-8 lg:p-16">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            " Este servicio web permite a las pequeñas empresas tener un control de sus inventarios y ventas de manera sencilla y eficiente."
                        </p>
                        <footer className="text-sm text-gray-400">Equipo de desarrollo</footer>
                    </blockquote>
                </div>

                {error && (
                    <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
                        <div className="flex items-start">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                            <div>
                                <AlertTitle className="font-bold">Usuario invalido</AlertTitle>
                                <AlertDescription className="text-pretty">
                                    {error}
                                </AlertDescription>
                            </div>
                            <button
                                className="ml-4 bg-transparent hover:bg-white"
                                onClick={() => {
                                    clearError();
                                }}
                            >
                                <IoMdClose />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center p-8">
                    <div className="max-w-sm w-full space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Sign Up
                            </h1>
                            <p className="text-sm text-gray-400">
                                Ingresa tu correo electronico y crea una contraseña para crear una cuenta
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="nombre@ejemplo.com"
                                    className="bg-transparent border-gray-800 focus:border-gray-600"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    className="bg-transparent border-gray-800 focus:border-gray-600"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <Button className="w-full bg-white text-black hover:bg-gray-200" disabled={!isFormValid} onClick={handleSubmit} >
                                {loading ? 'Registrando...' : 'Registrarse'}
                            </Button>

                        </div>

                        <p className="text-center text-sm text-gray-400">
                            Dandole click a registar, aceptara nuestros {" "}
                            <a href="/" className="underline hover:text-white">
                                Terminos de Servicio
                            </a>{" "}
                            y{" "}
                            <a href="/" className="underline hover:text-white">
                                Politica de Privacidad
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
