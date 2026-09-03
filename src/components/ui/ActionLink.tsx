import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ActionLinkProps {
  children: ReactNode
  to: string
  variant?: 'primary' | 'secondary' | 'light'
}

export function ActionLink({
  children,
  to,
  variant = 'primary',
}: ActionLinkProps) {
  const className = `action-link action-link--${variant}`
  const content = (
    <>
      <span>{children}</span>
      <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
    </>
  )

  if (to.startsWith('#')) {
    return (
      <a className={className} href={to}>
        {content}
      </a>
    )
  }

  return (
    <Link className={className} to={to}>
      {content}
    </Link>
  )
}
