# Page snapshot

```yaml
- dialog "Unhandled Runtime Error" [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - navigation [ref=e7]:
          - button "previous" [disabled] [ref=e8]:
            - img "previous" [ref=e9]
          - button "next" [disabled] [ref=e11]:
            - img "next" [ref=e12]
          - generic [ref=e14]: 1 of 1 error
          - generic [ref=e15]:
            - text: Next.js (14.2.33) is outdated
            - link "(learn more)" [ref=e17] [cursor=pointer]:
              - /url: https://nextjs.org/docs/messages/version-staleness
        - button "Close" [ref=e18] [cursor=pointer]:
          - img [ref=e20]
      - heading "Unhandled Runtime Error" [level=1] [ref=e23]
      - paragraph [ref=e24]: "TypeError: Cannot read properties of null (reading 'username')"
    - generic [ref=e25]:
      - heading "Source" [level=2] [ref=e26]
      - generic [ref=e27]:
        - link "src\\app\\page.tsx (35:55) @ username" [ref=e29] [cursor=pointer]:
          - generic [ref=e30]: src\app\page.tsx (35:55) @ username
          - img [ref=e31]
        - generic [ref=e35]: "33 | <div className=\"w-3 h-3 bg-green-500 rounded-full animate-pulse\"></div> 34 | <p className=\"text-green-600 dark:text-green-400 font-medium\"> > 35 | Authenticated as: {session.user.username} | ^ 36 | </p> 37 | </div> 38 | <Link href=\"/admin\">"
      - heading "Call Stack" [level=2] [ref=e36]
      - button "Show collapsed frames" [ref=e37] [cursor=pointer]
```