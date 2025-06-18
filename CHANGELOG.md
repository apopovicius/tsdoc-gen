# Change Log

All notable changes to the "tsdoc-gen" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.3.0] - 2025-06-19

Fix regression that prevents extension for properly work. No TSDOC comment was generating.
The issue was related to the fact that I externalize ts-morph and i could not import it afterwards.

**Limitation** - bundle size encreased as ts-morph is not part of the extension.

## [0.2.3] - 2025-05-30

Patch update containing a refresh of the readme section

## [0.2.2] - 2025-05-30

### ✨ Added

- **`ConstructorHandler`**:
  - Generates TSDoc comments for class constructors.
  - Supports `@param` tags based on constructor parameters.
- **`generateForConstructor()`** in `tsdocTemplates`:
  - Outputs `@param` tags and a default constructor description.
- Support for recognizing:
  - `ConstructorDeclaration`
  - Arrow functions assigned via top-level `const`/`let`

### 🛠️ Fixed

- Fixed: `Ctrl+Alt+D` command did not generate comments when the cursor was on the same line as the declaration.
- Fixed: `/*!` above a declaration broke TypeScript parsing, causing missed matches.
- Fixed: `extractParamMetadata()` now uses `.getText(param)` to reliably resolve parameter types.
- Fixed: Inserting comments no longer leaves extra blank lines or `/*!` behind.

### 🧹 Improved

- Unified declaration resolution:
- Uses `getSameLineDeclaration()` or `getNextLineDeclaration()` based on context.
- Replaced `/*!` trigger lines cleanly when detected.
- Improved arrow function TSDoc output to include `@param` and `@returns`.

### 🧪 Testing

- Added unit tests for:
  - `ConstructorHandler` (with/without params).
  - Arrow functions with typed and untyped parameters.
- Added debug logging for handler resolution (optional in dev).

---

## [0.2.1] - 2025-05-30

Temporary version for testing

---

## [0.2.0] - 2025-05-30

### ✨ Added

- Multiline detection for function, classes, arrow function etc
- Support for `VariableDeclaration` nodes (`const`, `let`, `var`) via new `VariableHandler`
- Accurate type extraction using `getTypeNode()` and `getBaseTypeOfLiteralType()`
- Configuration-driven generation:
  - `includeReturnsForVoid`
  - `includeEmptyParamBlock`
- Fallback handler now works for unsupported nodes without throwing runtime errors
- Inline test coverage for all templates and handlers
- `generateForVariable()` in `tsdocTemplates`

### 🧹 Improved

- All handlers now accept `options` from `TSDocGeneratorOptions`
- Templates now properly pass `includeParams` and `includeReturns` flags to `TSDocBuilder`
- `addReturns()` in `TSDocBuilder` now accepts void-like types conditionally based on config
- `addParams()` now renders an empty `@param` block when requested
- Add support for **CTRL+ALT+D** to work also on empty line

### 🛠️ Fixed

- Fix the bug when **/\*!** was not executing if no other generation was not executed before(eg. **CTRL+ALT+D**)
- `@param` block is now rendered when `includeEmptyParamBlock` is enabled — even if no parameters exist
- Type resolution for inferred primitives now returns correct type names (e.g., `"boolean"` instead of `"true"`)
- `@returns` is no longer skipped when configured to include `void`, `undefined`, or `null`
- Fallback test now passes without requiring a valid `ts-morph` Node
- Class method TSDoc generation test no longer grabs the class instead of the method

## [0.1.2] - 2025-05-29

### ✨ Added

- N/A

### 🧹 Improved

- Reduce sized of the extension

### 🛠️ Fixed

- CI pipeline now runs unit and end2end test

## [0.1.1] - 2025-05-29

### ✨ Added

- N/A

### 🧹 Improved

- Temporary disabled the config option for parameters functionality

### 🛠️ Fixed

- N/A

## [0.1.0] - Initial version

### ✨ Added

- Initial version

### 🧹 Improved

- N/A

### 🛠️ Fixed

- N/A
