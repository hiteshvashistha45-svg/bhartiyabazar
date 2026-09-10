import json
from pathlib import Path
path = Path('/home/ubuntu/.manus/config/config.json')
data = json.loads(path.read_text())
for item in data.get('connectors', []):
    if item.get('name') == 'Vercel':
        item['enabled'] = True
        break
else:
    raise SystemExit('Vercel connector not found')
path.write_text(json.dumps(data, indent=2) + '\n')
