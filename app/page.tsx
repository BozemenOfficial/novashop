import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({ orderBy:{createdAt:"desc"} });
  return (
      <main>
        <div className="container">
        <section className="hero">
          <div className="heroMain">
            <div className="eyebrow"><span className="eyebrowDot" /> NEW SEASON · 2026</div>
            <h1>Everyday essentials.<br/><span>Better selected.</span></h1>
            <p>A refined collection of modern wardrobe staples and accessories, curated for city life.</p>
            <div className="heroActions">
              <Link href="#catalog" className="btn heroButton">Shop collection <span>→</span></Link>
              <span className="heroNote">Free delivery on orders over $150</span>
            </div>
          </div>
          <div className="heroVisual" aria-hidden="true">
            <div className="heroOrb" />
            <div className="heroCard cardOne"><span>04</span><strong>curated pieces</strong></div>
            <div className="heroCard cardTwo"><span>100%</span><strong>secure checkout</strong></div>
          </div>
        </section>

        <section className="trustBar" aria-label="Store benefits">
          <div><strong>Fast dispatch</strong><span>Within 1–2 business days</span></div>
          <div><strong>Easy returns</strong><span>14-day return window</span></div>
          <div><strong>Secure account</strong><span>Protected order history</span></div>
        </section>

        <section className="section" id="catalog">
          <div className="sectionHead">
            <div><div className="kicker">THE EDIT</div><h2>Selected for you</h2></div>
            <span className="muted">{products.length} products</span>
          </div>
          <div className="grid">
            {products.map(p => (
              <article className="card product" key={p.id}>
                <div className="productImage">
                  <Image src={p.image} alt={p.name} fill sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw" />
                  <span className="stockPill">{p.stock > 0 ? "In stock" : "Sold out"}</span>
                </div>
                <div className="body">
                  <span className="badge">{p.category}</span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="row">
                    <span className="price">{formatPrice(p.price)}</span>
                    {p.stock > 0 && <AddToCartButton product={{id:p.id,name:p.name,price:p.price}}/>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        </div>
      </main>
  );
}
