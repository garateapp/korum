<?php
$models = glob('app/Models/*.php');
foreach($models as $model) {
    if (strpos($model, 'User.php') !== false) continue; // Keep standard fillable for user
    $content = file_get_contents($model);
    if (strpos($content, 'protected $guarded') === false) {
        $content = preg_replace('/class\s+\w+\s+extends\s+Model\s*\{/s', "$0\n    protected \$guarded = [];\n", $content);
        file_put_contents($model, $content);
        echo "Updated \$model\n";
    }
}
