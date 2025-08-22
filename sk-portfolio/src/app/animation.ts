import { trigger, transition, style, query, group, animate } from '@angular/animations';

// Helper function for the new slide animation
const slideTo = (direction: 'left' | 'right') => {
  const optional = { optional: true };
  const fromState = direction === 'right' ? '-100%' : '100%';
  const toState = direction === 'right' ? '100%' : '-100%';

  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction === 'right' ? 'left' : 'right']: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction === 'right' ? 'left' : 'right']: fromState })
    ]),
    group([
      query(':leave', [
        animate('500ms ease-in-out', style({ [direction === 'right' ? 'left' : 'right']: toState }))
      ], optional),
      query(':enter', [
        animate('500ms ease-in-out', style({ [direction === 'right' ? 'left' : 'right']: '0%' }))
      ])
    ]),
  ];
};


export const slider =
  trigger('routeAnimations', [
    // --- NEW: Specific, high-priority animations ---
    transition('HomePage => BlogPage', slideTo('right')),
    transition('BlogPage => HomePage', slideTo('left')),
    
    // --- YOUR ORIGINAL: The default animation for all other routes ---
    transition('* <=> *', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
          transform: 'scale(0.9) translateY(1%)',
        })
      ], { optional: true }),
      query(':enter', [
        animate('400ms ease',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ], { optional: true })
    ]),
  ]);