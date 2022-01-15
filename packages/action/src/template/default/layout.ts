import { render } from 'mustache';

const html = `
<!DOCTYPE html>

<html>
  <head>
    <meta charset="utf-8">
    <title>Review apps</title>
    <meta name="description" content="QA every PR effortlessly">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <style>
      body { font-family: Roboto; }
    </style>
  </head>
  <body>
    {{> children}}
  </body>
</html>
`;

export const layout = ({ children }: { children: string }) => {
  return render(html, {}, { children });
};
