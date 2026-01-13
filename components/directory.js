import React, { Fragment } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import PropTypes from 'prop-types'

const DirectoryItem = ({ href, children }) => {
    const router = useRouter()
    const isActive = router.pathname === href
  
    return (
      <Link href={href}>
        <a className="block w-full">
          <div className="relative p-[8px] flex items-center justify-center overflow-hidden group">
            <span
              className={`
                ${
                  isActive
                    ? 'text-primary1'
                    : 'text-primary2'
                }
                text-base md:text-2xl
                italic font-bold
                whitespace-nowrap
                relative z-10
                transition duration-300
                group-hover:underline group-focus:underline
                decoration-primary1
              `}
            >
              {children}
            </span>
            <div
              className="
                absolute inset-0
                transform translate-y-full
                bg-gradient-to-b from-secondary1 to-secondary2
                transition ease-in duration-300
                group-hover:translate-y-0
                group-focus:translate-y-0
              "
            />
          </div>
        </a>
      </Link>
    )
  }

const Directory = () => {
  const router = useRouter()
  const showParams =
    router.query['Display Price'] === 'true' ||
    router.query['Display Barcode'] === 'true'
      ? '?Display+Price=true&Display+Barcode=true'
      : ''

  return (
    <nav className="w-full">
      <ul className="flex flex-wrap justify-evenly w-full list-none bg-secondary1 px-4">
        <li className="flex flex-1 w-full items-center justify-center">
          <DirectoryItem href={`/cigars${showParams}`}>
            Cigars
          </DirectoryItem>
        </li>
        <li className="flex flex-1 w-full items-center justify-center">
          <DirectoryItem href="/pipes">Pipes</DirectoryItem>
        </li>
        <li className="flex flex-1 w-full items-center justify-center">
          <DirectoryItem href="/caffeine">Coffee &amp; Tea</DirectoryItem>
        </li>
        <li className="flex flex-1 w-full items-center justify-center">
          <DirectoryItem href="/tobacco">Tobacco</DirectoryItem>
        </li>
        <li className="hidden md:flex flex-1 w-full items-center justify-center">
          <DirectoryItem href="/about">About</DirectoryItem>
        </li>
      </ul>
    </nav>
  )
}

export default Directory