import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Input, Button, Alert } from '../';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import resetImage from '../../assets/6.jpg';

// --- Animaciones de Framer Motion ---
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

function FormularioSolicitarReset() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await authService.requestPasswordReset(email);
      setMessage(response.message || 'Código de recuperación enviado. Revisa tu correo.');

      setTimeout(() => {
        navigate('/cambiar-password-reset', { state: { email: email } });
      }, 2000);
    } catch (err) {
      console.error('Error al solicitar código de recuperación:', err);
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

  return (
    <div className="relative bg-white dark:bg-[var(--color-background)] border border-[var(--border-primary)] rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden md:flex md:min-h-[600px]">
      {/* Columna de la Imagen */}
      <motion.div
        className="hidden md:block md:w-1/2 relative overflow-hidden"
        variants={imageVariants}
      >
        <img
          src={resetImage}
          alt="Fondo de recuperación de contraseña"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 to-secondary/70"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <div className="text-white z-10">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-lg">
              Recupera tu Acceso
            </h2>
            <p className="text-lg lg:text-xl font-light opacity-90 leading-relaxed">
              Ingresa tu correo electrónico para recibir un código y restablecer tu contraseña.
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
          ¿Olvidaste tu Contraseña?
        </motion.h2>
        <motion.p
          className="text-base text-[var(--color-text-secondary)] text-center mb-8"
          variants={textVariants}
          transition={{ delay: 0.1 }}
        >
          Te enviaremos un código de recuperación a tu correo electrónico.
        </motion.p>

        {/* Mensajes de feedback */}
        <AnimatePresence>
          {message && <Alert key="success-alert" type="success" message={message} />}
          {error && <Alert key="error-alert" type="error" message={error} />}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Correo Electrónico"
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setMessage(''); setError(''); }}
            required
            placeholder="tu@correo.com"
            startIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
          />

          <Button type="submit" loading={loading} className="py-3 mt-6">
            {loading ? 'Enviando...' : 'Solicitar Reset'}
          </Button>
        </form>

        <p className="mt-6 text-center text-text-dark text-sm">
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-secondary underline"
          >
            Volver al inicio de sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default FormularioSolicitarReset; 