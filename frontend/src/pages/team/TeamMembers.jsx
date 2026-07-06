import { useMemo, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Reveal from '../../components/Reveal';
import TeamCard from './TeamCard';

export default function TeamMembers() {
  const { data, loading, error } = useFetch('/team', []);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const members = useMemo(() => data?.data || [], [data]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <Reveal>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-6 pr-2 lg:flex-nowrap">
          {members.map((member, index) => {
            const isHovered = hoveredIndex === index;
            const dimmed = hoveredIndex !== null && hoveredIndex !== index;

            return (
              <div
                key={member._id || member.name}
                className={[
                  'transition duration-[350ms]',
                  dimmed ? 'opacity-70' : 'opacity-100'
                ].join(' ')}
              >
                <TeamCard
                  member={member}
                  index={index}
                  hovered={isHovered}
                  onHover={() => setHoveredIndex(index)}
                  onLeave={() => setHoveredIndex(null)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
