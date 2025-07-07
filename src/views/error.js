import React from 'react'
import Link from '../router/link'

export const AppError = () => <div>
  <h2>Sorry, but the page does not exist.</h2>
  <Link to="/"> {"<"} Back to home</Link>
</div>
