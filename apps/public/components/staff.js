import Image from "next/image";
import BasicParagraph from '../components/basicParagraph'
import BasicSection from '../components/basicSection'
import { PiUsersDuotone } from "react-icons/pi";

export default function Staff() {
    const staff = [
        {
            name: "Edward Trout",
            role: "Sole Proprietor",
            image: "/edtrout.jpg",
            alt: "Edward Trout, Sole Proprietor"
        },
        {
            name: "Theodore McDonald",
            role: "Tobacconist",
            image: "/tedmcdonald.jpg",
            alt: "Theodore McDonald, Tobacconist"
        },
    ];
    // TODO: Get staff portraits professionally done

    return (
        <BasicSection
            backdropSrc="/kschairs.jpg"
            title="Meet the Staff"
            titleIcon={PiUsersDuotone}
        >
            <BasicParagraph className="text-center text-secondary2 mb-10">
                Ed and Ted are experienced tobacconists, dedicated to providing expert advice to every customer.
            </BasicParagraph>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:max-w-full max-w-sm md:mx-5 mx-auto">
                {staff.map((member) => (
                    <StaffMember key={member.name} {...member} />
                ))}
            </div>
        </BasicSection>
    );
}

function StaffMember({ name, role, image, alt }) {
    return (
        <article className="group overflow-hidden rounded-xl border border-secondary2/30 bg-primary2/80 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-primary2/25 to-secondary2/20">
                <Image
                    src={image}
                    alt={alt || name}
                    layout="fill"
                    objectFit="cover"
                    className="transition duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 border border-secondary2/30" />
            </div>
            <div className="flex flex-col items-center gap-1 px-4 py-3 text-center">
                <h3 className="text-lg font-semibold text-secondary2">{name}</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-secondary2/80">{role}</span>
            </div>
        </article>
    );
}
