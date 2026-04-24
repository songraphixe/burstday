import Badge from '../ui/Badge';
import { getRelationshipLabel, getRelationshipEmoji } from '../../lib/utils';

export default function RelationshipBadge({ type }) {
  return (
    <Badge variant="default">
      {getRelationshipEmoji(type)} {getRelationshipLabel(type)}
    </Badge>
  );
}
