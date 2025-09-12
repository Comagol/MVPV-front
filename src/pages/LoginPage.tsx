import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  useToast
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import type { LoginRequest } from "../types";

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const[error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData);
      toast({
        title: 'Login exitoso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/vote');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesion');
    }finally {
      setIsLoading(false);
    }
  }
}