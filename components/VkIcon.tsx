export default function VkIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.2653 4.2653C3 5.5306 3 7.56707 3 11.64v.72c0 4.0729 0 6.1094 1.2653 7.3747S7.56706 21 11.64 21h.72c4.0729 0 6.1094 0 7.3747-1.2653S21 16.4329 21 12.36v-.72c0-4.07293 0-6.1094-1.2653-7.3747S16.4329 3 12.36 3h-.72C7.56706 3 5.5306 3 4.2653 4.2653zm1.7347 4.2347c.09636 4.6823 2.55576 7.5 6.6095 7.5h.2351v-2.6787c1.4764.1499 2.5773 1.2536 3.0268 2.6787h2.1286c-.5775-2.1318-2.0747-3.3105-3.0052-3.7608.9298-.5569 2.2458-1.9071 2.5557-3.7392h-1.9365c-.4064 1.48991-1.6152 2.8401-2.7701 2.9683v-2.9683h-1.9675v5.1967c-1.19737-.2997-2.75931-1.7572-2.82331-5.1967z"
      />
    </svg>
  );
}

