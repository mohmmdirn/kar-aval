<?php
if (isset($_POST['color'])) {
  file_put_contents('site-color.txt', $_POST['color']);
  echo 'ok';
} else {
  echo 'no color';
}
?> 