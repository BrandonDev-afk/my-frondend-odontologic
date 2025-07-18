import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, KeyIcon } from '@heroicons/react/24/outline';

// Importa los componentes Input, Button, Alert
import { Input, Button, Alert } from '../';
import { authService } from '../../services';

// Nueva imagen para la página de activación
import activateImage from '../../assets/6.jpg';

function FormularioActivarCuenta() {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: '',
  });

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  
  // Determinar si el email fue pre-cargado
  const isEmailPreloaded = !!location.state?.email;

  useEffect(() => {
    if (message || error || resendMessage || resendError) {
      setMessage('');
      setError('');
      setResendMessage('');
      setResendError('');
    }
  }, [formData.email, formData.code]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setResendMessage('');
    setResendError('');

    try {
      const response = await authService.activateAccount(formData.email, formData.code);

      setMessage(response.message || 'Cuenta activada correctamente. ¡Bienvenido a Odontologic!');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error('Error al activar cuenta:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
      } else {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setResendMessage('');
    setResendError('');
    setMessage('');
    setError('');

    try {
      if (!formData.email) {
        setResendError('Por favor, ingresa tu correo electrónico para reenviar el código.');
        setResendLoading(false);
        return;
      }
      const response = await authService.resendActivationCode(formData.email);
      setResendMessage(response.message || 'Código de activación reenviado. Revisa tu correo.');
    } catch (err) {
      console.error('Error al reenviar código:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setResendError(err.response.data.error);
      } else if (err.request) {
        setResendError('No se pudo conectar con el servidor para reenviar el código.');
      } else {
        setResendError('Ocurrió un error inesperado al reenviar el código. Inténtalo de nuevo.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 10, delay: 0.3 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="relative bg-white dark:bg-[var(--color-background)] border border-[var(--border-primary)] rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden md:flex md:min-h-[600px]">
      {/* Columna de la Imagen (visible en md y superior) */}
      <motion.div
        className="hidden md:block md:w-1/2 relative overflow-hidden"
        variants={imageVariants}
      >
        <img
          src={activateImage}
          alt="Fondo de activación de cuenta de Odontologic"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/70 to-primary/70"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <div className="text-white z-10">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-lg">
              ¡Casi Listo!
            </h2>
            <p className="text-lg lg:text-xl font-light opacity-90 leading-relaxed">
              Un último paso para acceder a todos los beneficios de tu cuenta Odontologic.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Columna del Formulario */}
      <motion.div
        className="w-full md:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-center"
        variants={formVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-main)] text-center mb-4"
          variants={textVariants}
        >
          Activa tu Cuenta
        </motion.h2>
        <motion.p
          className="text-base text-[var(--color-text-secondary)] text-center mb-8"
          variants={textVariants}
          transition={{ delay: 0.1 }}
        >
          {isEmailPreloaded 
            ? "Tu correo electrónico ha sido pre-cargado. Solo necesitas pegar el código de activación."
            : "Ingresa el código de activación enviado a tu correo electrónico."
          }
        </motion.p>

        <AnimatePresence>
          <Alert type="success" message={message} />
          <Alert type="error" message={error} />
          <Alert type="success" message={resendMessage} />
          <Alert type="error" message={resendError} />
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Correo Electrónico"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isEmailPreloaded}
            placeholder={isEmailPreloaded ? "Email pre-cargado" : "tu_correo@example.com"}
            startIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
          />

          <Input
            label="Código de Activación"
            id="code"
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="Ingresa tu código aquí"
            pattern="^[0-9a-fA-F]{16}$"
            title="El código debe ser de 16 caracteres hexadecimales."
            startIcon={<KeyIcon className="h-5 w-5 text-gray-400" />}
          />

          <Button type="submit" loading={loading} className="py-3 mt-6">
            {loading ? 'Activando...' : 'Activar Cuenta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-[var(--color-text-secondary)] text-sm">
          ¿No recibiste el código?{' '}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendLoading || loading}
            className="font-semibold text-primary hover:text-secondary underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? 'Enviando...' : 'Reenviar Código'}
          </button>
        </p>
        <p className="mt-2 text-center text-[var(--color-text-secondary)] text-sm">
          ¿Ya activaste tu cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-secondary underline"
          >
            Inicia Sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default FormularioActivarCuenta; 