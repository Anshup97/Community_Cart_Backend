import Image from 'next/image'
import React from 'react'

export default function Footer() {
    return (
        <footer className="footer p-10 bg-neutral text-neutral-content">
            <div>
                <Image src='/community-cart.jpg' alt='Community Cart' width={30} height={30} />
                <p>Community Cart Ltd.<br />Your neighborhood store.</p>
            </div>
        </footer>
    )
}
