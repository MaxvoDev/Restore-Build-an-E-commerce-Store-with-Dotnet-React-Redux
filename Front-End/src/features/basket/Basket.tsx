import { BasketItem } from "../../app/models/basket";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "./BasketSlice";
import EmptyBasketMessage from "./EmptyBasket";


export default function BasketPage() {
    const dispatch = useAppDispatch();
    const { basket, status } = useAppSelector(state => state.basket);

    async function handleAdItem(productId: number) {
        await dispatch(addBasketItemAsync({
            productId: productId,
            quantity: 1
        }));
    }
    async function handleRemoveItem(productId: number, quantity: number) {
        await dispatch(removeBasketItemAsync({
            productId, quantity
        }));
    }

    if (!basket || !basket.items.length) return <EmptyBasketMessage />

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Subtotal</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket?.items.map((product: BasketItem) =>
                            <TableRow key={product.productId}>
                                <TableCell>
                                    <img width="50" src={product.pictureUrl} alt={product.name} />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>
                                    <LoadingButton loading={ status === "pendingRemoveItem" + product.productId }
                                        onClick={() => handleRemoveItem(product.productId, 1)} color="error">
                                        <Remove />
                                    </LoadingButton>
                                    {product.quantity}
                                    <LoadingButton loading={ status.includes("pendingAddItem" + product.productId) }
                                        onClick={() => handleAdItem(product.productId)} color="primary">
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
                                <TableCell>${(product.price * product.quantity / 100).toFixed(2)}</TableCell>
                                <TableCell>
                                    <LoadingButton loading={ status === "pendingRemoveItem" + product.productId } onClick={() => handleRemoveItem(product.productId, product.quantity)} color="error">
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                <BasketSummary />
                    <Button
                        component={Link}
                        to="/checkout"
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        >
                            CHECK OUT
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}   