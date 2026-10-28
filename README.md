# Solomon's Glasses

One topic. Two hours of research. Three minutes to present.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Topics

Topics live in [`data/topics.json`](data/topics.json): about 640 topics across 20 categories. Add or remove entries freely.

```json
{
  "topics": [
    { "text": "The Great Emu War of 1932", "category": "History" }
  ]
}
```

- `text`: the topic shown on reveal. It should be specific enough to research in two hours.
- `category`: a short label shown above the topic.

Topics don't repeat until every one has been shown. The history is kept in the browser's `localStorage`.

## Flow

1. **Reveal:** click the button (or press Space/Enter) to get a random topic.
2. **Research:** a 2-hour countdown.
3. **Present (optional):** a 3-minute countdown. Turn it on or off with the "Presentation timer" switch.

Timers store their end time, so they stay accurate if you refresh the page or the tab is in the background.
