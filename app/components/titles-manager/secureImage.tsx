"use client";

import "@/app/globals.css";
import Image from "next/image";
import { Key, useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";

export default function SecureImage(props: {
    titleId: Key | null | undefined;
    titleName: string;
    dev: boolean;
}) {
    const user = useUser({ or: "redirect" });
    const [secureImageSrc, setSecureImageSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        /**
         * Fetch the secure image from the API
         * @returns The secure image source
         */
        const fetchSecureImage = async () => {
            try {
                const token = await user
                    ?.getAuthJson()
                    .then((res) => res.accessToken);
                const response = await fetch(
                    `https://api${props.dev ? "-dev" : ""}.relaxg.app/images/` +
                        props.titleName.replaceAll(" ", "_") +
                        "_cover.jpg",
                    {
                        headers: {
                            "x-stack-access-token": token ?? "",
                        },
                    },
                );

                if (!response.ok) {
                    throw "Failed to fetch secure image";
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setSecureImageSrc(imageUrl);
                setIsLoading(false);
                // Clean up the object URL when the component unmounts
                return () => URL.revokeObjectURL(imageUrl);
            } catch (error) {
                console.warn(`Error loading secure image ${props.titleId}`);
                setIsLoading(false);
            }
        };

        fetchSecureImage();
    }, []);

    // Taking advantage of the Next Image component ability to load images from a URL before mounting the component.
    // The request to this endpoint will never resolve
    if (!secureImageSrc && isLoading) {
        return (
            <Image
                src={`https://api${props.dev ? "-dev" : ""}.relaxg.app/images/`}
                alt="Loading"
                className="h-full mb-0 overflow-hidden animate-no-transform"
                width={300}
                height={0}
                style={{ backgroundColor: "var(--background)" }}
            />
        );
    }

    return (
        <Image
            src={secureImageSrc ?? "https://api-dev.relaxg.app/images/error/"}
            alt={`cover-${props.titleId}`}
            className="h-full mb-0 overflow-hidden animate-no-transform"
            width={300}
            height={0}
            style={{ backgroundColor: "var(--background)" }}
        />
    );
}
