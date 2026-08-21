import { cn } from '@/components/ui/Primitives';

/**
 * Animated fire-gradient text.
 *
 * The gradient is laid out at 200% width and its background-position is
 * scrubbed by a CSS keyframe, which is what produces the shimmer — animating
 * position rather than the colour stops keeps it on the compositor and off the
 * main thread. `bg-clip-text` needs a transparent fill to show through.
 *
 * Pure CSS on purpose: this renders inside server components, and a Framer
 * loop here would force `'use client'` on every heading that uses it.
 */
export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-amber-500 via-orange-600 to-red-600',
        'bg-[length:200%_auto] bg-clip-text text-transparent',
        'animate-shimmer motion-reduce:animate-none',
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Renders `text`, with the first occurrence of `phrase` wrapped in the
 * gradient. Case-insensitive match; falls back to plain text when the phrase
 * is absent, so changing the copy in `lib/site.ts` can never break a heading.
 */
export function GradientPhrase({
  text,
  phrase,
  className,
}: {
  text: string;
  phrase: string;
  className?: string;
}) {
  const at = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (at === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <GradientText className={className}>{text.slice(at, at + phrase.length)}</GradientText>
      {text.slice(at + phrase.length)}
    </>
  );
}
