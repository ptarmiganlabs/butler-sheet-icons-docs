name: Pull Request
description: Submit changes to the documentation
title: ''

body:
  - type: markdown
    attributes:
      value: |
        Thank you for contributing to the Butler Sheet Icons documentation! Please provide details about your changes.

  - type: dropdown
    id: change-type
    attributes:
      label: Type of Change
      description: What type of change are you making?
      multiple: true
      options:
        - Bug fix (typo, broken link, incorrect info)
        - Content update (new information, examples)
        - New documentation (new pages, sections)
        - Enhancement (improved explanations, reorganization)
        - Visual improvements (images, formatting)
        - Configuration/technical updates
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: Description
      description: Describe the changes you made and why
      placeholder: This PR adds documentation for... / This PR fixes...
    validations:
      required: true

  - type: textarea
    id: pages-affected
    attributes:
      label: Pages/Sections Affected
      description: List the pages or sections you modified
      placeholder: |
        - /guide/quick-start.md
        - /examples/qscloud.md
        - docs/.vitepress/config.js (navigation)

  - type: checkboxes
    id: testing
    attributes:
      label: Testing Checklist
      description: Please confirm you have tested your changes
      options:
        - label: Tested locally with `npm run docs:dev`
          required: true
        - label: Verified all links work correctly
          required: true
        - label: Checked that images display properly
          required: true
        - label: Built successfully with `npm run docs:build`
          required: true
        - label: Previewed production build with `npm run docs:preview`
          required: false

  - type: checkboxes
    id: content-quality
    attributes:
      label: Content Quality
      description: Please confirm your changes meet quality standards
      options:
        - label: Content is accurate and tested
          required: true
        - label: Writing is clear and follows existing style
          required: true
        - label: Examples are practical and working
          required: false
        - label: Cross-references are updated where needed
          required: false
        - label: Images have descriptive alt text
          required: false

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots (if applicable)
      description: Include screenshots of UI changes or new content

  - type: textarea
    id: additional-notes
    attributes:
      label: Additional Notes
      description: Any other information that reviewers should know

  - type: checkboxes
    id: final-checks
    attributes:
      label: Final Verification
      description: Please confirm
      options:
        - label: I have read the contributing guidelines
          required: true
        - label: My changes follow the project coding standards
          required: true
        - label: I have updated navigation/config if adding new pages
          required: false