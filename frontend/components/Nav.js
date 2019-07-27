import Link from "next/link"
import { Mutation } from "react-apollo"

import User from "./User"
import SignOut from "./SignOut"
import CartCount from "./CartCount"
import NavStyles from "./styles/NavStyles"

import { TOGGLE_CART_MUTATION } from "./Cart"

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <SignOut />
          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {toggleCart => (
            <button onClick={toggleCart}>
              My Cart
              <CartCount
                count={me.cart.reduce(
                  (total, { quantity, item }) =>
                    !item ? total : total + quantity,
                  0
                )}
              />
            </button>
          )}
        </Mutation>
      </NavStyles>
    )}
  </User>
)

export default Nav
