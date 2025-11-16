import * as RadixTooltip from '@radix-ui/react-tooltip';
import '../styles/tooltip.css';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

export const Tooltip = ({
  children,
  content,
  side = 'top',
  delayDuration = 300,
}: TooltipProps) => {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content className="tooltip-content" sideOffset={5} side={side}>
            {content}
            <RadixTooltip.Arrow className="tooltip-arrow" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};