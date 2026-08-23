import Link from "next/link";
import { getSession } from "@/lib/auth";
import { CartLink } from "@/components/CartLink";
import { LogoutButton } from "@/components/LogoutButton";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="nav">
      <div className="container navin">
        <Link href="/" className="logo" aria-label="NovaShop home">Nova<span>Shop</span></Link>
        <nav className="navlinks" aria-label="Main navigation">
          <Link href="/#catalog">Shop</Link>
          <CartLink />
          {session ? (
            <>
              <Link href="/orders">Orders</Link>
              {session.role === "ADMIN" && <Link href="/admin" className="adminLink">Admin</Link>}
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="loginLink">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
