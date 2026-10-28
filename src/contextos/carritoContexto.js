
import { createContext } from 'react'

// El contexto vive en su propio archivo; CarritoProvider lo llena y useCarrito lo lee.
export const CarritoContexto = createContext(null)
