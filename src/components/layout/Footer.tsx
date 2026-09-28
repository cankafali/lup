import { a11y, footer } from "@/content/copy";
import { site } from "@/content/site";
import { FitText } from "@/components/primitives/FitText";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Stamp } from "@/components/primitives/Stamp";
import { waLink } from "@/lib/whatsapp";

const LINK = "tap underline-offset-4 hover:underline";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="col-span-3 max-lg:col-span-4 max-md:col-span-2">
      <MonoLabel tone="lead" className="block">
        {title}
      </MonoLabel>
      <div className="mt-3 text-body whitespace-pre-line">{children}</div>
    </div>
  );
}

/** Site altı (§10.6). Lup burada boşta (`data-loupe-off`). */
export function Footer() {
  return (
    <footer data-loupe-off className="relative">
      <div className="container-lup">
        <div className="grid-lup gap-y-10 border-t border-graphite pt-[60px]">
          <Column title={footer.columns.address}>
            {`${site.address.area},\n${site.address.street}`}
          </Column>
          <Column title={footer.columns.contact}>
            <a href={`tel:${site.phone.tel}`} className={LINK}>
              {site.phone.display}
            </a>
            {"\n"}
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className={LINK}>
              {footer.whatsapp}
              <span className="sr-only">{a11y.newTab}</span>
            </a>
          </Column>
          <Column
            title={footer.columns.hours}
          >{`${site.hours.days}\n${site.hours.from}–${site.hours.to}`}</Column>
          <Column title={footer.columns.follow}>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className={LINK}>
              {footer.instagram}
              <span className="sr-only">{a11y.newTab}</span>
            </a>
          </Column>
        </div>

        <div className="relative mt-16">
          {/* Wordmark'ın sağ üstünde üst üste iki damga */}
          <div aria-hidden className="absolute right-0 bottom-full flex flex-col items-end gap-2">
            <Stamp shape="oval">{footer.stamps.founded}</Stamp>
            <Stamp>{footer.stamps.hallmark}</Stamp>
          </div>
          <FitText
            estimate="23.5vw"
            className="font-sans leading-[0.8] font-medium tracking-display"
          >
            {footer.wordmark}
          </FitText>
        </div>

        {/* relative: wordmark'ın (konumlu kap) taşan kutusunun üstünde kalsın, "YUKARI" tıklanabilsin */}
        <div className="relative grid grid-cols-3 items-baseline gap-4 py-6 font-mono text-mono-s text-lead max-md:grid-cols-1 max-md:gap-1">
          <span>{footer.copyright}</span>
          <span className="text-center max-md:text-left">{footer.motto}</span>
          <a href="#" className={`justify-self-end max-md:justify-self-start ${LINK}`}>
            {footer.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
