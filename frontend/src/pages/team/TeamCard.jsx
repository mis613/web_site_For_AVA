import { motion } from 'framer-motion';

function TeamContactIcon({ type, href }) {
  if (!href) return null;

  const path =
    type === 'email'
      ? 'M4 6h16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2Zm0 2v.3l8 5.2 8-5.2V8H4Zm16 8V10l-7.4 4.8c-.3.2-.6.2-.8 0L4 10v6h16Z'
      : 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-9 14H7v-7h3v7Zm-1.5-8.2A1.5 1.5 0 1 1 9.5 6a1.5 1.5 0 0 1-1.5 2.8ZM17 17h-3v-3.7c0-.9 0-2-1.3-2S11.2 13 11.2 14V17h-3v-7h2.9v1c.4-.7 1.4-1.3 2.8-1.3 2.1 0 3.1 1.3 3.1 3.8V17Z';

  return (
    <a
      href={href}
      aria-label={type === 'email' ? 'Email' : 'LinkedIn'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition duration-[350ms] hover:bg-white/20"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}

export default function TeamCard({ member, index, hovered = false, onHover, onLeave }) {
  const imageSrc = member.photo || member.image || '';
  const linkedInHref = member.linkedin || member.linkedIn || member.linkedinUrl || '';
  const emailHref = member.email ? `mailto:${member.email}` : member.emailHref || '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: hovered ? 1.04 : 1 }}
      transition={{ delay: index * 0.1, duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={[
        'group relative h-[360px] w-[260px] shrink-0 overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_12px_32px_rgba(17,24,39,0.08)] transition duration-[350ms]',
        hovered
          ? 'z-10 shadow-[0_28px_70px_rgba(17,24,39,0.22)]'
          : 'hover:-translate-y-3 hover:shadow-[0_26px_60px_rgba(17,24,39,0.18)]'
      ].join(' ')}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageSrc}
          alt={member.name || 'Team member'}
          className={[
            'h-full w-full object-cover transition duration-[350ms]',
            hovered ? 'scale-[1.08]' : 'group-hover:scale-[1.08]'
          ].join(' ')}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#120f1b]/90 via-[#120f1b]/25 to-transparent opacity-90" />

      <div
        className={[
          'absolute inset-x-0 bottom-0 p-5 text-white transition duration-[350ms]',
          hovered ? 'bg-white/15 backdrop-blur-md' : 'bg-white/12 backdrop-blur-md'
        ].join(' ')}
      >
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-2xl font-semibold tracking-tight text-white">{member.name}</h3>
            <p className="mt-1 text-base font-medium text-white/85">{member.designation}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <TeamContactIcon type="linkedin" href={linkedInHref} />
            <TeamContactIcon type="email" href={emailHref} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
