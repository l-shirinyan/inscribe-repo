import { Text } from "@/components/ui/text";
import { useContent } from "@/components/landing/constants";
import { cn } from "@/lib/utils";

export const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <Text variant="Base" className="text-center">
    {children}
  </Text>
);

export const BulletList = ({ items }: { items: string[] }) => (
  <ul className="flex flex-col gap-4">
    {items.map((item, index) => (
      <li key={index}>
        <Paragraph>{item}</Paragraph>
      </li>
    ))}
  </ul>
);

export const Section = ({
  title,
  paragraphs,
  list,
  subsections,
  className,
}: any) => (
  <div className={cn("mb-5 sm:mb-10", className)}>
    <h2 className="text-xl font-bold text-center mb-4">{title}</h2>

    {paragraphs?.map((p: string, i: number) => (
      <Paragraph key={i}>{p}</Paragraph>
    ))}

    {list && <BulletList items={list} />}

    {subsections?.map((sub: any, i: number) => (
      <div key={i} className="mt-6">
        {sub.subtitle && (
          <h3 className="text-lg font-semibold text-center mb-2">
            {sub.subtitle}
          </h3>
        )}
        {sub.text && <Paragraph>{sub.text}</Paragraph>}
        {sub.list && <BulletList items={sub.list} />}
      </div>
    ))}
  </div>
);
export default function PrinciplesContent() {
  const content = useContent();
  
  return (
    <>
      {content.map((section, index) => (
        <Section key={index} {...section} />
      ))}
    </>
  );
}
