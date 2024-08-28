"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { GoHomeFill } from "react-icons/go";

const RelativeBreadCrumb = () => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <GoHomeFill />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const linkName = link[0].toUpperCase() + link.slice(1);
          const isLastPath = pathNames.length === index + 1;
          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {!isLastPath ? (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{linkName}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{linkName}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default RelativeBreadCrumb;
