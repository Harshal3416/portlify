import Image from "next/image";

export const renderImage = (image: any, forCart: boolean) => {
    if (!image) return '🖼️ ';

    const baseProps = {
        alt: "Product image",
        className: `object-contain  ${forCart? 'h-12' : ''}`,
    };

    if (typeof image === "string") {
        return (
            <Image
                src={process.env.NEXT_PUBLIC_BACKEND_URL + image}
                width={forCart ? 48 : 400}
                height={forCart ? 48 : 400}
                {...baseProps}
            />
        );
    }

    if (typeof image === "object" && "url" in image && image.url) {
        return (
            <Image
                src={process.env.NEXT_PUBLIC_BACKEND_URL + image.url}
                width={forCart ? 48 : 400}
                height={forCart ? 48 : 400}
                {...baseProps}
            />
        );
    }

    // For Blob objects (temporary previews), keep using img tag
    return (
        <Image
            width={40}
            height={40}
            src={URL.createObjectURL(image as Blob)}
            {...baseProps}
        />
    );
    };