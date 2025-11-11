# Experience Validation Tool

The Experience Validation Tool ensures that your escape room experiences are completable and all puzzle paths are logically sound.

## Quick Start

### Validate an Experience

```bash
npm run validate <experience_id>
```

**Examples:**
```bash
npm run validate training_basement
npm run validate sheriffs_last_ride
```

## What It Validates

### Critical Checks (Errors)

These must pass for an experience to be considered valid:

- **Structure**: All required fields are present (id, name, rooms, startingRoomId)
- **References**: All triggerIds, itemIds, and keyIds reference existing objects
- **Completion Criteria**: All completion requirements can be satisfied
- **Reachability**: All items and triggers needed for completion are accessible
- **Circular Dependencies**: No key is locked behind a door that requires the same key

### Warnings

These should be reviewed but won't fail validation:

- Unreachable items (items that can't be obtained)
- Missing clues for code-based locks
- Orphaned items (not referenced anywhere)

### Info Messages

Helpful statistics about the experience:

- Number of rooms
- Number of reachable items/triggers
- Number of clues per puzzle

## Understanding the Report

### Example Output

```
═══════════════════════════════════════════════════════════
Experience: Training Basement (training_basement)
═══════════════════════════════════════════════════════════

✅ VALIDATION PASSED - Experience is completable!

ℹ️  INFO (2):
  1. [structure] Experience has 1 room(s)
  2. [puzzle_clues] Keypad lock "exit_door_keypad" has 1 clue(s)

📊 REACHABILITY ANALYSIS:
  Reachable Items: 12
  Unreachable Items: 0
  Reachable Triggers: 2

═══════════════════════════════════════════════════════════
```

### Exit Codes

- **0**: Validation passed, experience is completable
- **1**: Validation failed, errors found

## How It Works

### Dependency Graph

The validator builds a graph of all items, triggers, and keys:

1. **Items**: All objects in rooms (furniture, containers, portable items)
2. **Triggers**: Locks, keypads, examination triggers
3. **Keys**: Physical keys, codes, clues, hints

### Reachability Analysis

The validator simulates gameplay to determine what's accessible:

1. **Starting State**: Identifies items visible and unlocked in the starting room
2. **Iterative Expansion**: Finds keys → unlocks containers → finds more items
3. **Trigger Activation**: Checks if required keys/codes can be obtained
4. **Completion Check**: Verifies all completion criteria are reachable

### Example Flow

For Training Basement:

```
1. Room: desk, filing_cabinet, poster, vent, exit_door visible
2. Open filing_cabinet_top → find brass_key
3. Use brass_key → unlock desk_drawer_middle
4. Open desk_drawer_middle → find partial_code_note (clue: "17")
5. Examine vent → see clue "42"
6. Combine clues: 42 + 17 = 4217
7. Enter code 4217 on exit_door_keypad → SUCCESS
```

The validator verifies each step is possible.

## Common Errors and Fixes

### Error: "Completion requires trigger X but it is not reachable"

**Problem**: The win condition can't be achieved.

**Common Causes**:
- Key locked in container that needs the key (circular dependency)
- Missing key or clue for final door
- Code digits not provided in clues

**Fix**: Trace backwards from completion criteria:
1. What trigger is required to win?
2. What key/code does that trigger need?
3. Where is that key/code located?
4. Can the player reach that location?

### Error: "Key X references non-existent trigger: Y"

**Problem**: A key references a trigger that doesn't exist.

**Fix**: Check the `associatedTriggerId` field in the `keys` array matches an actual trigger `id`.

### Error: "Item X is unreachable"

**Problem**: An item can't be accessed.

**Causes**:
- Item in locked container with no key
- Item in hidden room with no way to reveal it

**Fix**: Add a key to unlock the container, or remove the lock.

### Error: "Circular dependency: Key X is locked in container that requires the same key"

**Problem**: Key is inside a container that needs that same key to open.

**Fix**: Move the key to an accessible location, or provide the key elsewhere.

## Best Practices

### When Creating a New Experience

1. **Start with structure**: Define rooms, items, triggers
2. **Add completion criteria**: Specify what needs to happen to win
3. **Trace the path**: Mentally walk through the puzzle solution
4. **Run validation**: `npm run validate your_experience_id`
5. **Fix errors**: Address any validation failures
6. **Test manually**: Play through to verify fun factor

### When Modifying an Experience

1. **Run validation before**: Establish baseline
2. **Make changes**: Modify JSON
3. **Run validation after**: Check for new errors
4. **Commit only if valid**: Don't commit broken experiences

### Validation Checklist

Before committing a new/modified experience:

- [ ] `npm run validate experience_id` passes
- [ ] All items have appropriate categories and properties
- [ ] All triggers have rewards defined
- [ ] All locks have corresponding keys
- [ ] All code-based locks have sufficient clues
- [ ] Completion criteria are clearly defined
- [ ] Manual playthrough works as expected

## Advanced Usage

### Add Your Experience to Validator

Edit `scripts/validate-experience.js`:

```javascript
const experiencePaths = {
  'training_basement': path.join(__dirname, '../experiences/training_basement/experience.json'),
  'sheriffs_last_ride': path.join(__dirname, '../experiences/sheriffs_last_ride/experience.json'),
  'your_new_experience': path.join(__dirname, '../experiences/your_experience/experience.json'), // ADD THIS
};
```

### Validate All Experiences

Create a script to validate all experiences at once:

```bash
npm run validate training_basement && npm run validate sheriffs_last_ride
```

### CI/CD Integration

Add validation to your build pipeline:

```yaml
# .github/workflows/validate.yml
name: Validate Experiences
on: [push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run validate training_basement
      - run: npm run validate sheriffs_last_ride
```

## Troubleshooting

### Validator Reports False Negative

If the validator says something is unreachable but you can access it in-game:

1. Check the `keyId` field on items matches the key `id` in the `keys` array
2. Verify `lockTriggerId` fields reference correct triggers
3. Ensure `associatedTriggerId` links keys to their locks
4. Check item `isVisible` and `isLocked` states

### Validator is Too Slow

The validator uses iterative reachability analysis (max 10 iterations). For very complex experiences:

1. Check for unnecessary nesting (containers inside containers)
2. Simplify circular references
3. Reduce number of items

### Need More Debug Information

Uncomment debug console.log statements in `ExperienceValidator.ts` for detailed output.

## Future Enhancements

Planned improvements:

- [ ] Validate difficulty ratings match actual complexity
- [ ] Check estimated duration vs actual play time
- [ ] Detect dead-end puzzle paths
- [ ] Suggest hints when puzzles are too hard
- [ ] Visual dependency graph output
- [ ] Automated solution path generation

## Questions?

If you encounter validation errors you can't resolve, check:

1. This documentation
2. Example experiences (training_basement, sheriffs_last_ride)
3. ExperienceValidator.ts source code comments

---

**Remember**: The validator helps ensure completability, but it can't assess whether the experience is fun or well-paced. Always playtest!
