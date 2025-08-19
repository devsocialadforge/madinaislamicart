import Image from "next/image";

export function Avatar({
  src,
  alt,
  initials,
}: {
  src?: string;
  alt?: string;
  initials: string;
}) {
  if (src) {
    return (
      <div className="overflow-hidden rounded-full h-11 w-11 bg-ironstone-gray/10 ring-1 ring-ironstone-gray/20">
        {/* Use fill layout for crisp circle crop */}
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt ?? ""}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center rounded-full h-11 w-11 bg-sunrise-amber/20">
      <span className="text-sm font-semibold font-poppins text-sunrise-amber">
        {initials}
      </span>
    </div>
  );
}
