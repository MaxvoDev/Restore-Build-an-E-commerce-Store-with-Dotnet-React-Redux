import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ProductDetail from "../../features/catalog/ProductDetail";
import Catalog from "../../features/catalog/Catalog";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/Basket";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import SignIn from "../../features/account/SignIn";
import SignUp from "../../features/account/SignUp";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '',
                element: <HomePage />
            },
            {
                path: 'catalog',
                element: <Catalog />
            },
            {
                path: 'catalog/:id',
                element: <ProductDetail />
            },
            {
                path: 'about',
                element: <AboutPage />
            },
            {
                path: 'contact',
                element: <ContactPage />
            },
            {
                path: 'server-error',
                element: <ServerError />
            },
            {
                path: 'basket',
                element: <BasketPage />
            },
            {
                path: 'checkout',
                element: <CheckoutPage />
            },
            {
                path: 'signin',
                element: <SignIn />
            },
            {
                path: 'signup',
                element: <SignUp />
            },
            {
                path: 'not-found',
                element: <NotFound />
            },
            {
                path: '*',
                element: <Navigate replace to='/not-found' />
            }
        ]
    }
]);