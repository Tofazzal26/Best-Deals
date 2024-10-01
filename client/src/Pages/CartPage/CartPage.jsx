import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import CartCard from "../../Components/CartCard/CartCard";
import CheckOutForm from "../../Components/CheckOutForm/CheckOutForm";
import LeftMenubar from "../../Components/LeftMenuBar/LeftMenuBar";
import PaymentModal from "../../Components/Modals/PaymentModal";
import NoData from "../../Components/NoData/NoData";
import { ScrollRestoration } from "react-router-dom";
import { useState } from "react";



const CartPage = () => {

    // cart data from redux store
    const cart = useSelector((state) => state.cart)


    // Calculate total quantity and total amount
    const totalQuantity = cart.cartIteams.reduce((total, item) => total + item.cartQuantity, 0);

    const totalAmount = cart.cartIteams.reduce((total, item) => total + (item.cartQuantity * item.price), 0);

    // Apply discount 
    const discount = 0.00 * totalAmount;
    const grandTotal = totalAmount - discount;

    // state for contact information
    const [contactInfo, setContactInfo] = useState({})

    // contact info
    const onSubmit = async (data) => {

        // fetch data from the form
        const { address, contact, name, paymentMethod } = data;

        setContactInfo(data);
    }

    return (
        <div className=" flex p-5 gap-5">
            <Helmet>
                <title>Best Deal | Cart list</title>
            </Helmet>
            <ScrollRestoration></ScrollRestoration>

            {/*Left Side menubar / categorybar  */}
            <div className="flex-1">
                <LeftMenubar></LeftMenubar>
            </div>

            {/* cart list */}
            <div className="w-full lg:w-3/4 flex flex-col lg:flex-row gap-5 justify-around ">
                <div className="w-full lg:w-[65%] ">
                    {
                        cart.cartIteams.length === 0 ?
                            <div><NoData></NoData></div> :
                            <div>
                                {
                                    cart.cartIteams?.map(product =>
                                        <CartCard
                                            key={product._id}
                                            product={product}
                                        ></CartCard>)
                                }
                            </div>
                    }
                </div>

                {/* Total bill Table */}
                <div className="flex-grow" >
                    <div className=" bg-[rgb(217,217,217)] dark:bg-[#34394C] dark:text-white  h-fit">
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th className="text-white dark:text-black dark:bg-[#D6DFF2] bg-[#775050]">Quantity</th>
                                        <th className="text-white dark:text-black dark:bg-[#D6DFF2] bg-[#775050]">Total Amounts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Quantity & Total Amounts */}
                                    <tr>
                                        <td>{totalQuantity}</td>
                                        <td>$ {totalAmount.toFixed(2)}</td>
                                    </tr>
                                    {/* Discount */}
                                    <tr>
                                        <td>Discount</td>
                                        <td>0%</td>
                                    </tr>
                                    {/* Grand Total */}
                                    <tr>
                                        <td>Grand Total</td>
                                        <td>$ {grandTotal.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>


                        {(contactInfo !== undefined || contactInfo !== null)
                            ? <CheckOutForm onSubmit={onSubmit}></CheckOutForm>
                            : <div className="hidden">
                            <CheckOutForm onSubmit={onSubmit}></CheckOutForm>
                            </div>
                        }


                        {/* payment method */}
                        {
                            contactInfo?.paymentMethod === "Card"
                            && <PaymentModal
                                CheckoutPrice={parseInt(grandTotal.toFixed(2))}
                                contactInfo={contactInfo}
                            />
                        }

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartPage;