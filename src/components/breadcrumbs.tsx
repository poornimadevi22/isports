'use client';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  console.info('You clicked a breadcrumb.');
}

interface BreadcrumbRoutes {
  title: string;
  route: string;
  currentPage: boolean;
  disabled: any
}

interface BreadcrumbsProps {
  routes: BreadcrumbRoutes[];
}

export default function BasicBreadcrumbs(props: any) {
  const { routes, setOpen } = props;

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        {routes.map((item: any, index: any) => (
          item.currentPage ? (
            <Typography key={index} className="dubai-med primary-color">
              {item.title}
            </Typography>
          ) : (
            item.disabled ? (
              <Typography
                key={index}
                className="dubai-med"
                onClick={() => {
                  setOpen(true)
                }}
                style={{
                  cursor: "pointer"
                }}
              >
                {item.title}
              </Typography>
            ) :
              <Link
                underline="none"
                color="inherit"
                href={item.route}
                key={index}
                className="dubai-med"
              >
                {item.title}
              </Link>
          )
        ))}
      </Breadcrumbs>
    </div>
  );
}
