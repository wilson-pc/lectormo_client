export function getHTML() {
  return ` <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
        <title>{{title}}</title>
        <style>
          .responsive {
            max-width: 100%;
            height: auto;
            vertical-align: middle;
          }
        </style>
      </head>
      <body>
        {{#each images}}
        <img src="{{file}}" alt="" class="responsive" />
        {{/each}}
      </body>
    </html>
    
    `;
}
